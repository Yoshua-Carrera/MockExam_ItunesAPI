const api = (() => {
    const getData = (ARTIST_NAME) => {
        url = `https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200`;
        const response = fetch(url).then((response) => response.json());
        return response;
    };
    return { getData };
})();

const view = (() => {
    const elements = {
        albumList: ".album-list",
        queryBar: ".searchbar",
        searchButton: ".searchButton",
    };

    const createTMP = (albumArray) => {
        TMP = "";
        albumArray.forEach((album) => {
            TMP += `
            <li class="album">
                <img src="${album.artworkUrl100}" />
                <span>${album.collectionCensoredName}</span>
            </li>
        `;
        });
        return TMP;
    };

    const render = (TMP, searchLenght, searchTarget) => {
        const albumElement = document.querySelector(elements.albumList);
        const searchData = document.querySelector("#search-data");
        searchData.innerHTML = `${searchLenght} results for "${searchTarget}"`;
        albumElement.innerHTML = TMP;
    };

    return {
        elements,
        createTMP,
        render,
    };
})();

const model = ((view, api) => {
    class album {
        constructor(title, artwork) {
            this.title = title;
            this.artwork = artwork;
        }
    }

    class state {
        #albumCollection = [];
        artist = null;

        get albumCollection() {
            return this.#albumCollection;
        }

        set albumCollection(newAlbumCollection) {
            const albumLength = newAlbumCollection.length;
            this.#albumCollection = [...newAlbumCollection];
            console.log(this.#albumCollection);
            const TMP = view.createTMP(this.#albumCollection);
            view.render(TMP, albumLength, this.artist);
        }
    }

    const { getData } = api;

    return { getData, album, state };
})(view, api);

const controller = ((view, model) => {
    const state = new model.state();

    const init = () => {
        const searchbar = document.querySelector(view.elements.queryBar);
        const searchButton = document.querySelector(view.elements.searchButton);

        searchbar.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                model.getData(event.target.value).then((data) => {
                    console.log(data.results);
                    state.artist = event.target.value;
                    state.albumCollection = data.results;
                    event.target.value = "";
                });
            }
        });

        searchButton.addEventListener("click", (event) => {
            model.getData(searchbar.value).then((data) => {
                state.artist = event.target.value;
                state.albumCollection = data.results;
                searchbar.value = "";
            });
        });
    };

    return { init };
})(view, model);

controller.init();
