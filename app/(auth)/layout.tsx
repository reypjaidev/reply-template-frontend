import { RedirectIfAuthed } from "../lib/redux/features/auth/RedirectIfAuthed";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <RedirectIfAuthed>{children}</RedirectIfAuthed>
        </div>
    );
}

export default layout;
