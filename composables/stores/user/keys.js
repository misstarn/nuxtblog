export const useKeysStore = defineStore('keys', {
    state: () => ({
        username: '',
        email: '',
        checkbox: false
    }),
    getters: {},
    actions: {
        clearKeys(){
            this.username = ''
            this.email = ''
            this.checkbox = false
        }
    },
    persist: {
        storage: persistedState.localStorage
    },
})