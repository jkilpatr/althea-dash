import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Progress } from "reactstrap";
import { get } from "store";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const endpoints = [
  "/info",
  "/exits",
  "/settings",
  "/debts",
  "/neighbors",
  "/wifi_settings",
  "/dao_list",
  "/interfaces",
  "/mesh_ip",
  "/local_fee",
  "/metric_factor",
  "/auto_price/enabled",
  "/blockchain/get",
  "/usage/client",
  "/usage/relay",
  "/usage/payments"
];

const APIDump = () => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const data = JSON.stringify(results, null, 2);

  useEffect(
    () => {
      (async () => {
        setLoading(true);

        await Promise.all(
          endpoints.map(async path => {
            let res;
            try {
              res = await get(path);
              if (!(res instanceof Error)) {
                if (res.network) res.network.wgPrivateKey = "<redacted>";
                if (res.payment) res.payment.ethPrivateKey = "<redacted>";
              }
            } catch (e) {
              res = e.message;
            }

            results[path] = res;
          })
        );

        setResults(results);
        setLoading(false);
      })();
    },
    [results]
  );

  return (
    <div>
      <h1>{t("debuggingData")}</h1>
      {loading ? (
        <Progress animated color="info" value="100" />
      ) : (
        <Card className="my-4">
          <CardBody>
            <div className="float-right">
              <CopyToClipboard text={data} onCopy={() => setCopied(true)}>
                <a href="#endpoints" onClick={e => e.preventDefault()}>
                  <span>
                    <FontAwesomeIcon icon="copy" className="mr-2" />
                    {copied ? t("copied") : t("copyToClipboard")}
                  </span>
                </a>
              </CopyToClipboard>
            </div>
            <pre>{data}</pre>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default APIDump;