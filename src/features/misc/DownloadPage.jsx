import { client } from '../../services/sanity/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { FiDownload } from 'react-icons/fi';

import './downloadPage.css';

export default function DownloadPage() {
  const [documentsByType, setDocumentsByType] = useState({});
  useEffect(() => {
    async function fetchDocuments() {
      const documents = await client.fetch(`*[_type == 'download']`);
      const groupedDocuments = documents.reduce((acc, document) => {
        const type = document.type || '其他';
        if (!acc[type]) acc[type] = [];
        acc[type].push(document);
        return acc;
      }, {});
      // 排序順序映射
      const typeOrder = [
        '打工度假簽證申請',
        '打工度假履歷',
        '就職相關資料',
        '其他',
      ];

      // 按順序排序分組
      const sortedDocuments = Object.keys(groupedDocuments)
        .sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b))
        .reduce((acc, key) => {
          acc[key] = groupedDocuments[key];
          return acc;
        }, {});

      setDocumentsByType(sortedDocuments);
    }

    fetchDocuments();
  }, []);

  const currentURL = typeof window !== 'undefined' 
    ? `${window.location.origin}${location.pathname}` 
    : '';
  const imageURL = typeof window !== 'undefined' 
    ? `${window.location.origin}/LOGO-02-text.png` 
    : '';

  return (
    <>
      <Helmet>
        <title>
          Go
          Yours：高優資料下載專區｜日本留學申請表下載｜日本打工度假申請資料｜高優國際服務手冊下載｜日本簽證申請文件範本
        </title>
        <meta
          name="keywords"
          content="申請表格、資料下載、指南手冊、文件範本"
        />
        <meta
          name="description"
          content="高優整理的各種申請資料，包括了日本留學申請表、日本打工度假申請資料、高優國際服務手冊、日本簽證申請文件範本等等，讓你不會準備的手忙腳亂！"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：高優資料下載專區｜日本留學申請表下載｜日本打工度假申請資料｜高優國際服務手冊下載｜日本簽證申請文件範本"
        />
        <meta
          property="og:description"
          content="高優整理的各種申請資料，包括了日本留學申請表、日本打工度假申請資料、高優國際服務手冊、日本簽證申請文件範本等等，讓你不會準備的手忙腳亂！"
        />
        <meta property="og:url" content={currentURL} />
        <meta property="og:image" content={imageURL} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image:secure_url"
          content="https://www.goyours.tw/open_graph.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Go Yours Logo" />
        <meta
          name="twitter:title"
          content="Go Yours：高優資料下載專區｜日本留學申請表下載｜日本打工度假申請資料｜高優國際服務手冊下載｜日本簽證申請文件範本"
        />
        <meta
          name="twitter:description"
          content="高優整理的各種申請資料，包括了日本留學申請表、日本打工度假申請資料、高優國際服務手冊、日本簽證申請文件範本等等，讓你不會準備的手忙腳亂！"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <div className="downloadSection">
        <div className="download-KV">
          <h1>
            <span className="yellow download-title">Download</span>下載專區
          </h1>
        </div>
        <div className="download-body">
          <div className="download-wrapper">
            {Object.keys(documentsByType).map((type) => (
              <div key={type} className="download-section">
                <h2 className="yellow download-title">
                  <span className="goyoursbear goyoursbearonfaqs">
                    <svg
                      version="1.1"
                      id="_レイヤー_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 340.2 338"
                    >
                      <path
                        className="goyoursbear-line"
                        d="M36.6,337.5c0,0-13.5-150.2,68.7-211.6c0,0-5.4-16.2-40.1-28c0,0-12.5-5.6-15.7-16.7c0,0-1.1-14.6,0.7-16.9
	c0,0,0.9-1.8,3-2.1c0,0,39.1-7.4,41.8-8.1c0,0,2.5-1.2,3.3-3.3c0,0-0.5-9.9,1.9-11.8c0,0,1.4-1.4,2.3-1.9c0,0,27.8-8.8,48.3-12.7
	h1.8c0,0,3.7-17.8,22.7-10.1c0,0,11.1,5.6,5.8,20.3c0,0,0.2,2.5,0,4.8c0,0,46.4,29.8,51.6,84.9c0,0,79.4,32.1,70.9,213.5"
                      />
                    </svg>
                  </span>
                  {type}
                </h2>
                <ul className="downloadFiles-list">
                  {documentsByType[type].map((document) => (
                    <li key={document._id}>
                      {document.downloadDocument?.asset?._ref && (
                        <a
                          href={`https://cdn.sanity.io/files/${
                            client.config().projectId
                          }/${client.config().dataset}/${
                            document.downloadDocument.asset._ref.split('-')[1]
                          }.${
                            document.downloadDocument.asset._ref.split('-')[2]
                          }`}
                          download={
                            document.downloadDocument?.description || '檔案'
                          } // 設置文件下載的名稱
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiDownload />
                          {document.downloadDocument?.description || '檔案'}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
