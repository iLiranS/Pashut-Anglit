import { create } from "zustand";

let lastStoredTheme: 'light' | 'dark' = 'dark';
if (typeof window !== 'undefined') {
    lastStoredTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    if (lastStoredTheme==='dark') document.documentElement.classList.add('dark');
  }
  interface themeModel{
    theme:'dark' | 'light',
    toggleTheme : ()=>void
}
const useThemeStore = create<themeModel>((set)=>({
    theme: lastStoredTheme,
    toggleTheme: ()=> set((state)=>{
        const newTheme = state.theme ==='light' ? 'dark' : 'light';
            document.documentElement.classList.contains('dark')?document.documentElement.classList.remove('dark'):document.documentElement.classList.add('dark')
        localStorage.setItem('theme',newTheme);
        return{
            theme:newTheme
        }
    }),
}))
export default useThemeStore;