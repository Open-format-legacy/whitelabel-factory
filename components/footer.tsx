import useTranslation from "next-translate/useTranslation";

export default function Footer() {
  const { t } = useTranslation("common");
  return (
    <div className="fixed right-0 bottom-0 left-0 flex justify-center space-x-1 bg-zinc-900 p-2 text-center text-sm font-bold tracking-tight opacity-80">
      <p>{t("footer.text")}</p>
      <a
        className="underline hover:text-pink-500"
        href="https://simpleweb.co.uk/"
        rel="noreferrer"
        target="_blank"
      >
        <p>{t("footer.link")}</p>
      </a>
    </div>
  );
}
