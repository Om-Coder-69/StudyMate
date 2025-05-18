interface DistractionFreePlayerProps {
  videoId: string;
  title?: string;
}

export default function DistractionFreePlayer({ videoId, title = "YouTube Video" }: DistractionFreePlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white&controls=1`;

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
