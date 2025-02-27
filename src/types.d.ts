// This declaration file adds HTML element types to JSX.IntrinsicElements
// to fix the TypeScript errors in the project

import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Basic HTML elements
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      span: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
      >;
      p: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >;
      h1: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h2: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h3: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h4: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h5: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h6: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      a: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      button: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      form: React.DetailedHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >;
      input: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      label: React.DetailedHTMLProps<
        React.LabelHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
      >;
      select: React.DetailedHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
      >;
      option: React.DetailedHTMLProps<
        React.OptionHTMLAttributes<HTMLOptionElement>,
        HTMLOptionElement
      >;
      img: React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >;
      ul: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLUListElement>,
        HTMLUListElement
      >;
      ol: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLOListElement>,
        HTMLOListElement
      >;
      li: React.DetailedHTMLProps<
        React.LIHTMLAttributes<HTMLLIElement>,
        HTMLLIElement
      >;
      nav: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      header: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      footer: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      main: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      section: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      article: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      aside: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
