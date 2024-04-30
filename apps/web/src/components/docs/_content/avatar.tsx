import { MEDIA_URLS } from "@/lib/config/urls";
import { Button } from "@ui/components/ui/button";
import Image from "next/image";
import avatar from "public/avatar.jpeg";

export default function Avatar() {
  return (
    <div className="flex items-center gap-4">
      <Image src={avatar} alt="avatar" className="w-20 h-20 rounded-full" />
      <div>
        <p className="leading-none">Daniel Bílek</p>
        <p className="text-sm text-muted-foreground">front end engineer</p>
        {MEDIA_URLS.map((media) => (
          <Button asChild variant="ghost" className="mr-2">
            <a href={media.href} target="_blank" referrerPolicy="no-referrer">
              <media.icon className="w-5 h-5 fill-white" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
