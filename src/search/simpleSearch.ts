import { SearchBase, PredictResult } from './search';
import $, { Cash } from 'cash-dom';
import {
  SH_SELECT_CLASS,
  SH_PREDICT_CLASS,
  SH_HOVER_CLASS,
} from '../models/constant';

export class SimpleSearch extends SearchBase {
  private _currentBest: string = '';
  private _currentDiff: number = Number.MAX_VALUE;
  private _referenceElements: Cash = $([]);
  constructor() {
    super();
  }
  private resetSearch() {
    this._currentBest = '';
    this._currentDiff = Number.MAX_VALUE;
    this._referenceElements = $([]);
  }

  predict(e: Cash, referenceElements: Cash): PredictResult {
    let targetElement = e[0];

    if (!targetElement) {
      return {
        elements: $([]),
        suggestSelector: '',
        success: true,
      };
    }

    this.resetSearch();

    this._referenceElements = referenceElements;
    let previousPath: string[] = [];
    let searchNode = targetElement;
    let solutionFound = false;

    while (
      !solutionFound &&
      searchNode.tagName.toLocaleLowerCase() !== 'body'
    ) {
      const candidates = this.getElementCombination(searchNode, previousPath);

      for (let i = 0; i < candidates.length; i++) {
        solutionFound = this.checkResult(candidates[i]);
        if (solutionFound) {
          return {
            elements: $(this._currentBest),
            suggestSelector: this._currentBest,
            success: solutionFound,
          };
        }
      }

      previousPath.push(searchNode.tagName.toLocaleLowerCase());

      const p = $(searchNode).parent()[0];
      if (!!p) {
        searchNode = p;
      } else {
        break;
      }
    }

    return {
      elements: $(this._currentBest),
      suggestSelector: this._currentBest,
      success: solutionFound,
    };
  }

  getElementCombination(e: Element, previous: string[]): string[] {
    const tagName = e.tagName.toLocaleLowerCase();
    const res: string[] = [];

    if (previous.length === 0) {
      res.push(tagName);
      e.classList.forEach((cls) => {
        if (
          ![SH_SELECT_CLASS, SH_PREDICT_CLASS, SH_HOVER_CLASS].includes(cls)
        ) {
          res.push(`${tagName}.${cls}`);
        }
      });
    } else {
      previous.forEach((previousSelector) => {
        res.push(`${previousSelector} ${tagName}`);
        e.classList.forEach((cls) => {
          if (
            ![SH_SELECT_CLASS, SH_PREDICT_CLASS, SH_HOVER_CLASS].includes(cls)
          ) {
            res.push(`${tagName}.${cls} ${previousSelector}`);
          }
        });
      });
    }
    return res;
  }

  checkResult(currentSelector: string): boolean {
    const currentElements = $(currentSelector);

    const diff = Math.abs(
      currentElements.length - this._referenceElements.length
    );

    if (this._currentDiff > diff) {
      this._currentBest = currentSelector;
      this._currentDiff = diff;
    }

    if (diff === 0) {
      return true;
    }

    return false;
  }
}
