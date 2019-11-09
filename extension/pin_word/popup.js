// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let spread = document.getElementById('spread')
let settings = document.getElementById('settings')

let googleSpread = "https://docs.google.com/spreadsheets/d/"

chrome.storage.sync.get('sheetId', data => {
  spread.setAttribute('value', `${googleSpread}${data.sheetId}`)
})

settings.setAttribute('value', 'chrome-extension://nceninahkoiicioigbcmajeplaanmckh/options.html')

spread.onclick = (element) => {
  let url = element.target.value
  chrome.tabs.create({
    url
  })
}

settings.onclick = (element) =>  {
  let url = element.target.value
  chrome.tabs.create({
    url
  })
}

