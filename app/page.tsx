import { NoteBoard } from "./_components/NoteBoard";
import { RequireAuth } from "./lib/redux/features/auth/RequireAuth";

export default function Home() {
  return (
    <RequireAuth>
      <NoteBoard />
    </RequireAuth>
  );
}
