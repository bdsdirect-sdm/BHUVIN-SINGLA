import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <div className="language-switcher">
            <span>{t("language")}: </span>
            <button onClick={() => changeLanguage("en")}>English</button>
            <button onClick={() => changeLanguage("hi")}>हिन्दी</button>
            <button onClick={() => changeLanguage("fr")}>Français</button>
            <button onClick={() => changeLanguage("es")}>Español</button>
        </div>
    );
};

export default LanguageSwitcher;
