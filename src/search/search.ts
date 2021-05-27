import $, { Cash } from 'cash-dom';

export interface PredictResult {
  elements: Cash;
  suggestSelector: string;

  success: boolean;
}

export class SearchBase {
  getFullPath(e: Cash): string {
    const parents = e.parentsUntil('body');
    const tagNames: string[] = !!e[0] ? [e[0].tagName.toLocaleLowerCase()] : [];
    parents.each((i, ele) => {
      tagNames.push(ele.tagName.toLocaleLowerCase());
    });
    return tagNames.reverse().join(' ');
  }

  // getChildren(e: Cash): string[] {}

  predict(e: Cash, referenceElements: Cash): PredictResult {
    return {
      elements: $([]),
      suggestSelector: '',
      success: true,
    };
  }

  select(e: Cash): Cash {
    const pathName = this.getFullPath(e);
    if (e.length > 0) {
      const element = e[0];
      const sameElements: Node[] = [];
      element &&
        $(element.tagName.toLocaleLowerCase()).each((i, ele) => {
          const comparePathName = this.getFullPath($(ele));
          if (pathName === comparePathName) {
            sameElements.push(ele);
          }
        });
      return $(sameElements);
    } else {
      return $();
    }
  }
}
