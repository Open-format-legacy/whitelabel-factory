import useTranslation from "next-translate/useTranslation";

export default function Banner() {
  const { t } = useTranslation("common");

  const url = "https://simpleweb.gitbook.io/whitelabel/";
  return (
    <div className="bg-yellow-400 text-center font-semibold text-black">
      <p className="p-2">
        {t("banner.text")}
        <a className="underline hover:text-white" href={url} target="_blank" rel="noreferrer">
          {t("banner.link")}
        </a>
      </p>
    </div>
  );
}
