import useTranslation from "next-translate/useTranslation";

export default function Banner() {
  const { t } = useTranslation("common");
  // @todo Link to gitbooks when ready.
  const url = "";
  return (
    <div className="bg-yellow-400 text-center font-semibold text-black">
      <p className="p-2">
        {t("banner.text")}
        <a className="underline" href={url}>
          {t("banner.link")}
        </a>
      </p>
    </div>
  );
}
