async function main() {
    const defaultBgColor = '#d5d6d0';
    const keyInStorage = 'storedArrOfTabs'; 

    const visualTabsContainer = document.getElementById('visual-tabs-container')
    const loadTabsBtn = document.getElementById('load-tabs')
    const loadTabsTextArea = document.getElementById('ta-for-json')

    const recreateVisualTabs = async (tabs) => {
        if (tabs.length > 0) {
            try {
                arrOfTabs = JSON.parse(tabs);
            } catch (error) {
                alert('invalid json') 
                return;
            }

            visualTabsContainer.replaceChildren([])

            for (const tab of arrOfTabs) {
                const visualTab = document.createElement("button");

                visualTab.innerText = tab.displayName || "no name"; 
                visualTab.classList.add('link');
                visualTab.style.backgroundColor = tab.bgColor ? tab.bgColor : defaultBgColor; 
                visualTab.addEventListener('click', () => {
                    location.assign(tab.url);
                });

                visualTabsContainer.appendChild(visualTab);
            }

            await chrome.storage.local.set({ [keyInStorage]: tabs })
        }
    }

    loadTabsBtn.addEventListener('click', async () => {
        await recreateVisualTabs(loadTabsTextArea.value);
    });

    const res = await chrome.storage.local.get([keyInStorage])
    const savedTabs = res[keyInStorage];

    loadTabsTextArea.value = savedTabs;

    await recreateVisualTabs(savedTabs);
}

main()
