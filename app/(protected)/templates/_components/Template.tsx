import React from "react";
import TemplateHeader from "./Header";
import TemplateSearch from "./Search";
import TemplateForm from "./Form";
import TemplateCards from "./Cards";

const TemplateContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-10"> {children}</div>
    );
};

export default {
    Container: TemplateContainer,
    Header: TemplateHeader,
    Search: TemplateSearch,
    Form: TemplateForm,
    Cards: TemplateCards,
};
