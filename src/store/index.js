import create from 'zustand'
import {devtools, persist} from "zustand/middleware";
import config from "../config";
import storage from "../services/storage";


let store = (set) => ({
    user: null,
    isAuthenticated: false,
    breadcrumbs: [],
    setUser: (user) => set(state => ({...state, user})),
    setAuth: (isAuthenticated) => set(state => ({...state, isAuthenticated})),
    setBreadcrumbs: (breadcrumbs) => set(state => ({...state, breadcrumbs}))
})

let settingsStore = (set) => ({
    token: null,
    username: null,
    role: null,
    translateToken: null,
    lang: storage.get('lang') || config.DEFAULT_APP_LANG,
    setToken: (token) => set(state => ({...state, token})),
    setTranslateToken: (translateToken) => set(state => ({...state, translateToken})),
    setLang: (lang) => set(state => ({...state, lang})),
    setUsername: (username) => set(state => ({...state, username})),
    setRole: (role) => set(state => ({...state, role})),
})


store = devtools(store);
settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, {name: 'settings'});

export const useStore = create(store)
export const useSettingsStore = create(settingsStore)

