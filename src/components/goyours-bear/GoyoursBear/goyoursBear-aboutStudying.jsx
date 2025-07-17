import { useWindowSize } from '../../../hooks';

import './goyoursBear.css';

export default function GoyoursBearAboutStudying() {
  const windowSize = useWindowSize();

  return (
    <span className="goyoursbear-aboutstudying">
      <svg version="1.1" id="goyoursBear" viewBox="0 0 1200 348.7" width={250}>
        <path
          className="goyoursbear-line"
          d={`M0,337.5h${
            windowSize < 480 ? '700' : '700'
          }c0,0-13.5-150.2,68.7-211.6c0,0-5.4-16.2-40.1-28c0,0-12.5-5.6-15.7-16.7c0,0-1.1-14.6,0.7-16.9
	c0,0,0.9-1.8,3-2.1c0,0,39.1-7.4,41.8-8.1c0,0,2.5-1.2,3.3-3.3c0,0-0.5-9.9,1.9-11.8c0,0,1.4-1.4,2.3-1.9c0,0,27.8-8.8,48.3-12.7
	h1.8c0,0,3.7-17.8,22.7-10.1c0,0,11.1,5.6,5.8,20.3c0,0,0.2,2.5,0,4.8c0,0,46.4,29.8,51.6,84.9c0,0,79.4,32.1,70.9,213.5`}
        />
      </svg>
    </span>
  );
}
