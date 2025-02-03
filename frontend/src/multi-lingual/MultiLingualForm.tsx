import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "./MultiLingual.css";

const resources = {
    en: {
        translation: {
            form_title: "User Information Form",
            name: "Name",
            email: "Email",
            phone: "Phone Number",
            submit: "Submit",
            language: "Select Language",
        },
    },
    hi: {
        translation: {
            form_title: "उपयोगकर्ता जानकारी फॉर्म",
            name: "नाम",
            email: "ईमेल",
            phone: "फ़ोन नंबर",
            submit: "जमा करें",
            language: "भाषा चुनें",
        },
    },
    fr: {
        translation: {
            form_title: "Formulaire d'informations utilisateur",
            name: "Nom",
            email: "E-mail",
            phone: "Numéro de téléphone",
            submit: "Soumettre",
            language: "Choisir la langue",
        },
    },
    es: {
        translation: {
            form_title: "Formulario de información del usuario",
            name: "Nombre",
            email: "Correo electrónico",
            phone: "Número de teléfono",
            submit: "Enviar",
            language: "Seleccionar idioma",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

const MultiLingual: React.FC = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const savedData = localStorage.getItem("userFormData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("userFormData", JSON.stringify(formData));
        alert("✅ Data saved to local storage!");
    };


    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <div className="multi-lingual-container">

            <div className="language-switcher">
                <span>{t("language")}: </span>
                <button onClick={() => changeLanguage("en")}>English</button>
                <button onClick={() => changeLanguage("hi")}>हिन्दी</button>
                <button onClick={() => changeLanguage("fr")}>Français</button>
                <button onClick={() => changeLanguage("es")}>Español</button>
            </div>

            <div className="form-container">
                <h2>{t("form_title")}</h2>
                <form onSubmit={handleSubmit}>
                    <label>{t("name")}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>{t("email")}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>{t("phone")}</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

                    <button type="submit">{t("submit")}</button>
                </form>
            </div>
        </div>
    );
};

export default MultiLingual;
