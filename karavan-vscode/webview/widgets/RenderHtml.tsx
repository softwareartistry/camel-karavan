/**
 * @author Purushottam <purushottam.gour@314ecorp.com>
 * @description render html content.
 */

import React from "react";

interface IProps {
  htmlString?: string;
  disabled?: boolean;
}

const RenderHtml: React.FC<IProps> = ({ htmlString, disabled }) => {
  if (!htmlString) {
    return <div />;
  }
  return (
    <div
      className={disabled ? "detail-form-element" : ""}
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default RenderHtml;
