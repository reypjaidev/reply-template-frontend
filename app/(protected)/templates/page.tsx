import Template from "./_components/Template";

export default function Page() {
    return (
        <Template.Container>
            <Template.Header />
            <Template.Search />
            <Template.Form />
            <Template.Cards />
        </Template.Container>
    );
}
