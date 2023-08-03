async function main() {
    const keyInStorage = 'storedArrOfTabs'; 

    const visualTabsContainer = document.getElementById('visual-tabs-container')
    const loadTabsBtn = document.getElementById('load-tabs')
    const loadTabsTextArea = document.getElementById('ta-for-json')

    const addNewTabForm = document.getElementById('add-new-tab-form')
    const newTabUrl = document.getElementById('new-tab-url')
    const newTabName = document.getElementById('new-tab-name')
    const newTabBgColor = document.getElementById('new-tab-color')

    const recreateVisualTabs = async (tabsAsString) => {
        if (tabsAsString.length > 0) {
            try {
                arrOfTabs = JSON.parse(tabsAsString);
            } catch (error) {
                alert('invalid json')
                return;
            }

            visualTabsContainer.replaceChildren([])

            for (const tab of arrOfTabs) {
                const visualTab = document.createElement("button");

                visualTab.innerText = tab.displayName || "no name"; 
                visualTab.classList.add('link');
                visualTab.style.backgroundColor = tab.bgColor;
                visualTab.addEventListener('click', () => {
                    location.assign(tab.url);
                });

                visualTabsContainer.appendChild(visualTab);
            }

            await chrome.storage.local.set({ [keyInStorage]: tabsAsString })
        }
    }

    loadTabsBtn.addEventListener('click', async () => {
        await recreateVisualTabs(loadTabsTextArea.value);
    });

    const chromeStorage = await chrome.storage.local.get([keyInStorage]);
    const savedTabsAsString = chromeStorage[keyInStorage];

    loadTabsTextArea.value = savedTabsAsString;
    await recreateVisualTabs(savedTabsAsString);

    addNewTabForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let arrOfTabs = [];

        if (savedTabsAsString.length > 0) {
            try {
                arrOfTabs = JSON.parse(savedTabsAsString);
            } catch (error) {
                alert('invalid json');
                return;
            }
        }

        if (!newTabUrl.value.startsWith('https')) {
            alert('invalid url')
            return;
        }
        const newVisualTab = {
            url: newTabUrl.value,
            displayName: newTabName.value,
            bgColor: newTabBgColor.value
        }

        arrOfTabs.push(newVisualTab);
        const updatedTabsAsString = JSON.stringify(arrOfTabs, null, 2);

        await chrome.storage.local.set({ [keyInStorage]: updatedTabsAsString })
        loadTabsTextArea.value = updatedTabsAsString;
    })
}

main()
