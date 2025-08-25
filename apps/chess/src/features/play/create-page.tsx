"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@artic-frost/ui/components";
import {playClient} from "./api/client";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/lib/routes";
import {useState} from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      <h1 className="h1">Are you ready to play?</h1>
      <CreateForm />
    </div>
  );
}

// TODO: react-hook-forms, etc, i am too lazy now
function CreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const color = (e.target as HTMLFormElement).color.value;
    const data = await playClient
      .createGame({color})
      .finally(() => setLoading(false));

    if (data) {
      router.push(ROUTES.APP.PLAY(data.data.id));
    }
  };

  return (
    <form onSubmit={handleCreateGame} className="flex flex-col gap-4">
      <Select name="color" defaultValue="white_player">
        <SelectTrigger>
          <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="white_player">White</SelectItem>
          <SelectItem value="black_player">Black</SelectItem>
        </SelectContent>
      </Select>

      <Button className="w-[200px] h-[48px]" type="submit" loading={loading}>
        Play now
      </Button>
    </form>
  );
}

export {Page};
