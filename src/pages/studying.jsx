import { useEffect, useState } from 'react';
import School from '../components/school/school'; // 导入 School 组件
import './studying.css';
export default function Studying() {
  return (
    <>
      <div className="schoolPage">
        <School />
      </div>
    </>
  );
}
