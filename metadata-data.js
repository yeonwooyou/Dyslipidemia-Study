const SiteMetadata = (() => {
  const metadata = {
    archiveLastChecked: "2026-09-04",
    contentLastChecked: "2026-09-04",
    contentVersion: "v0.2.0",
    guidelineLastChecked: "2026-09-02",
    pageCount: 7,
    priceLastChecked: "2026-09-02",
    siteUpdatedAt: "2026-09-04"
  };

  const formatHeaderNote = () => `검증 기준 ${metadata.contentLastChecked} · ${metadata.contentVersion}`;
  const formatArchiveNote = () => `Archive checked ${metadata.archiveLastChecked} · Site updated ${metadata.siteUpdatedAt}`;

  return {
    ...metadata,
    formatArchiveNote,
    formatHeaderNote
  };
})();

globalThis.SiteMetadata = SiteMetadata;
