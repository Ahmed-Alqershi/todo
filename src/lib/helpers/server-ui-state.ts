"use server";

import { cookies } from "next/headers";

import { DEFAULT_UI_STATE } from "@/lib/stores/ui-store";

import type { Locale, SidebarState, Theme } from "@/lib/types";

export async function getServerSideUIState() {
  const cookieStore = await cookies();

  try {
    const uiStateCookie = cookieStore.get("uiState");

    if (!uiStateCookie?.value) {
      return DEFAULT_UI_STATE;
    }

    const parsedState = JSON.parse(uiStateCookie.value);
    return {
      theme: (parsedState.state.theme as Theme) || DEFAULT_UI_STATE.theme,
      locale: (parsedState.state.locale as Locale) || DEFAULT_UI_STATE.locale,
      sideBarState:
        (parsedState.state.sideBarState as SidebarState) ||
        DEFAULT_UI_STATE.sideBarState,
    };
  } catch (error) {
    console.error("Error parsing UI state cookie:", error);
    return DEFAULT_UI_STATE;
  }
}
