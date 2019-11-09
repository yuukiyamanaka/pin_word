// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  // popupを有効化
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher()],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  })
})

let errorCallback = (error) => {
  console.log(error)
  chrome.tabs.executeScript({
    code: 'window.alert("Error! Please confirm spread sheed ID.")'
  })
}

let successCallback = (res) => {
  console.log(res)
  /* doesn't work
  chrome.notifications.create(
    'success',
    { type: "basic", iconUrl: "images/32x32.png", title: 'success', message: 'success'},
    (r)=>{console.log(r)}
  )
  */
}

let postWord = (options) => {
  let retry = true
  chrome.identity.getAuthToken({ 'interactive': true }, token => {
    if (chrome.runtime.lastError) {
      errorCallback(chrome.runtime.lastError)
      return
    }

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
          // JSON response assumed. Other APIs may have different responses.
          successCallback(JSON.parse(xhr.responseText))
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
          errorCallback(xhr)
      }
    }

    xhr.open("POST", options.url, true)
    // Set standard Google APIs authentication header.
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    // onloadのコールバック関数を設定
    xhr.onload = () => {
      if (this.status === 401 && retry) {
        // This status may indicate that the cached
        // access token was invalid. Retry once with
        // a fresh token.
        retry = false
        chrome.identity.removeCachedAuthToken(
            { 'token': token },
            postWord)
        return
      }
    }

    let body = {
      values: [
        [options.word]
      ]
    }

    xhr.send(JSON.stringify(body))
  })
}

// メニューバーの作成
chrome.contextMenus.create({
  id: "nceninahkoiicioigbcmajeplaanmckh",
  title: chrome.i18n.getMessage('saveWord'),
  contexts: ['selection']
})

// メニューバーが押された時
// tokenを取得して、スプレッドシートに書き込む
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let word = info.selectionText
  chrome.storage.sync.get('sheetId', data => {
    console.log(data)
    postWord({
      'url': `https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
      word
    })
  })
})
