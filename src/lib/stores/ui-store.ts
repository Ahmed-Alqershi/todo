import Cookies from "js-cookie";
import { create } from "zustand";
import { devtools, persist, PersistStorage } from "zustand/middleware";

import type { Locale, SidebarState, Theme } from "@/lib/types";

import { i18n } from "@/lib/i18n.config";

// UIState Type
type UIState = {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  locale: Locale;
  updateLocale: (language: Locale) => void;
  sideBarState: SidebarState;
  toggleSideBarState: () => void;
};

export const DEFAULT_UI_STATE = {
  theme: "system" as Theme,
  locale: i18n.defaultLocale as Locale,
  sideBarState: "collapsed" as SidebarState,
};

// Custom storage object
const cookiesStorage: PersistStorage<{
  theme: Theme;
  locale: Locale;
  sideBarState: SidebarState;
}> = {
  getItem: (name) => {
    const str = Cookies.get(name);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error("Error parsing cookie:", error);
      return null;
    }
  },
  setItem: (name, value) => {
    Cookies.set(name, JSON.stringify(value), {
      expires: 30,
      secure: true,
      sameSite: "strict",
    });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  },
};

export const useUiStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: DEFAULT_UI_STATE.theme,
        updateTheme: (theme) => {
          set(() => ({ theme }), false, "toggleTheme");
          document.documentElement.setAttribute("data-theme", theme);
        },
        locale: DEFAULT_UI_STATE.locale,
        updateLocale: (locale) => {
          set(() => ({ locale: locale }), false, "toggleLocale");
        },
        sideBarState: DEFAULT_UI_STATE.sideBarState,
        toggleSideBarState: () => {
          set(
            (state) => {
              const newState: { sideBarState: SidebarState } = {
                sideBarState:
                  state.sideBarState === "expanded" ? "collapsed" : "expanded",
              };
              document.documentElement.setAttribute(
                "data-sidebarstate",
                newState.sideBarState
              );

              return newState;
            },
            false,
            "toggleSidebarState"
          );
        },
      }),
      {
        name: "uiState",
        storage: cookiesStorage,
        partialize: (state) => ({
          theme: state.theme,
          locale: state.locale,
          sideBarState: state.sideBarState,
        }),
      }
    ),
    {
      name: "UiStore",
      enabled: process.env.NODE_ENV !== "production",
    }
  )
);
