const keyNameInStorage = 'storedArrOfTabs'

async function saveTabsToStore(tabsAsString) {
    await chrome.storage.local.set({ [keyNameInStorage]: tabsAsString })
}

async function getTabsFromStore() {
    const chromeStorage = await chrome.storage.local.get([keyNameInStorage])
    const savedTabsAsString = chromeStorage[keyNameInStorage]

    return savedTabsAsString
}
