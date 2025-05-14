import React, { useState, useEffect } from "react";
import TopBanner from "./TopBanner";
import GitHubStarButton from "./GitHubStarButton";
import TokenSettingDialog from "./TokenSettingDialog";
import Link from "next/link";
import { AppStateProvider, useAppStore } from "../store";

const Header: React.FC = () => {
  const store = useAppStore()
  const [showSetTokenDialog, setShowSetTokenDialog] = useState(false);
  const [headerText, setHeaderText] = useState("Add Access Token");
  const [state, setState] = useState<State>({
    showDropMenu: false,
    showSetTokenDialog: false,
  });

  interface State {
    showDropMenu: boolean;
    showSetTokenDialog: boolean;
    tokenCache?: string;
  }

  const handleSetTokenBtnClick = () => {
    setShowSetTokenDialog(true);
  };

  const handleToggleDropMenuBtnClick = () => {
    setState((prevState) => ({
      ...prevState,
      showDropMenu: !prevState.showDropMenu,
    }));
  };

  const handleSetTokenDialogClose = () => {
    setShowSetTokenDialog(false);
  };

useEffect(() => {
  setHeaderText(store.token ? "Edit Access Token" : "Add Access Token")
}, [store.token]);

  return (
    <>
      {showSetTokenDialog && (
        <TokenSettingDialog
          onClose={handleSetTokenDialogClose}
          tokenCache={false}
        />
      )}

      <AppStateProvider>
        {/* <TopBanner /> */}
        <header className="w-full h-14 shrink-0 flex flex-row justify-center items-center bg-[#363636] text-light">
          <div className="w-full md:max-w-5xl lg:max-w-7xl h-full flex flex-row justify-between items-center px-0 sm:px-4">
            <div className="h-full bg-dark flex flex-row justify-start items-center">
              <Link href="/" className="h-full flex flex-row justify-center items-center px-3 hover:bg-zinc-800">
                <img className="w-7 h-auto" src="/assets/icon.png" alt="Logo" />
              </Link>
              <Link href="/blog"className="h-full flex flex-row justify-center items-center text-base px-3 hover:bg-zinc-800">
                <span className="text-white font-semibold -2">Blog</span>
              </Link>
              <span
                className="h-full flex flex-row justify-center items-center cursor-pointer text-white text-base px-3 font-semibold mr-2 hover:bg-zinc-800"
                onClick={handleSetTokenBtnClick}
              >
                {headerText}
              </span>
            </div>
            <div className="hidden h-full md:flex flex-row justify-center items-center px-4">
              <button 
                onClick={() => window.open('https://newsletter.star-history.com/subscribe', '_blank')}
                className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </div>
            <div className="h-full hidden md:flex flex-row justify-end items-center space-x-2">
              <a className="h-full flex flex-row justify-center items-center px-2 hover:bg-zinc-800" href="https://twitter.com/StarHistoryHQ" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter text-2xl text-blue-300"></i>
              </a>
              <a className="h-full flex flex-row justify-center items-center px-2 hover:bg-zinc-800" href="https://rss.beehiiv.com/feeds/BbNzf9ozGZ.xml" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-rss text-2xl text-orange-400"></i>
              </a>
              <GitHubStarButton />
            </div>

            <div className="h-full flex md:hidden flex-row justify-end items-center">
              <span
                className="relative h-full w-10 px-3 flex flex-row justify-center items-center cursor-pointer font-semibold text-light hover:bg-zinc-800"
                onClick={handleToggleDropMenuBtnClick}
              >
                <span className={`w-4 transition-all h-px bg-light absolute top-1/2 ${state.showDropMenu ? "w-6 rotate-45" : "-mt-1"}`}></span>
                <span className={`w-4 transition-all h-px bg-light absolute top-1/2 ${state.showDropMenu ? "hidden" : ""}`}></span>
                <span className={`w-4 transition-all h-px bg-light absolute top-1/2 ${state.showDropMenu ? "w-6 -rotate-45" : "mt-1"}`}></span>
              </span>
            </div>
          </div>
        </header>
        <div className={`w-full h-auto py-2 flex md:hidden flex-col justify-start items-start shadow-lg border-b ${state.showDropMenu ? "flex" : "hidden"}`}>
          <Link
            href="/blog/how-to-use-github-star-history"
            className="h-12 text-base px-3 w-full flex flex-row justify-start items-center cursor-pointer font-semibold text-dark mr-2 hover:bg-gray-100 hover:text-blue-500"
          >
            📕 How to use this site
          </Link>
          <span
            className="h-12 px-3 text-base w-full flex flex-row justify-start items-center cursor-pointer font-semibold text-dark mr-2 hover:bg-gray-100 hover:text-blue-500"
            onClick={handleSetTokenBtnClick}
          >
            {headerText}
          </span>
          <span className="h-12 text-base px-3 w-full flex flex-row justify-start items-center">
            <a
              className="github-button -mt-1"
              href="https://github.com/star-history/star-history"
              data-show-count="true"
              aria-label="Star star-history/star-history on GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star
            </a>
          </span>
        </div>
      </AppStateProvider>
    </>
  );
};

export default Header;
