import { create } from 'zustand'
import { getLUsers } from './common'

export const useGenerationStore = create()((set)=>({
    isLogin: false,
    setLogin: (isLogin)=> set({isLogin})
}))

export const useGenerationStore2 = create()((set)=>({
    users: [JSON.parse(getLUsers())],
    setUsers: (users)=> set({users})
}))
