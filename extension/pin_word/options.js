// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let submit = document.getElementById('submit')
let sheet = document.getElementById("sheet_id")
let notif = document.getElementById("notification")

chrome.storage.sync.get('sheetId', data => {
  sheet.setAttribute('value', `${data.sheetId}`)
})

submit.onclick = element => {
  let sheetId = sheet.value
  chrome.storage.sync.set(
    { sheetId },
    () => {
      notif.innerHTML = 'ok'
    }
  )
};