import React, { SVGProps } from 'react';

export default function TwilioLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em" {...props}>
      <path
        fillRule="evenodd"
        d="M0 10.5a.5.5 0 00.5.5h4a.5.5 0 000-1H3V1.5a.5.5 0 00-1 0V10H.5a.5.5 0 00-.5.5zM2.5 12a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2a.5.5 0 00-.5-.5zm3-6.5A.5.5 0 006 6h1.5v8.5a.5.5 0 001 0V6H10a.5.5 0 000-1H6a.5.5 0 00-.5.5zM8 1a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2A.5.5 0 008 1zm3 9.5a.5.5 0 00.5.5h4a.5.5 0 000-1H14V1.5a.5.5 0 00-1 0V10h-1.5a.5.5 0 00-.5.5zm2.5 1.5a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2a.5.5 0 00-.5-.5z"
      />
    </svg>
  );
}
