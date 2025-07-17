import React, { lazy, Suspense } from "react";
import LoadingBear from "../LoadingBear/loadingBear";

// 混合渲染包裝器 - 處理 CSR 組件的懶載入
const LazyWrapper = ({ children, fallback = <LoadingBear /> }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// 用於創建 CSR 組件的工廠函數
export const createCSRComponent = (importFn, displayName) => {
  const LazyComponent = lazy(importFn);
  LazyComponent.displayName = displayName;

  return (props) => (
    <LazyWrapper>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};

export default LazyWrapper;
