import $ from 'cash-dom';
import { GetDefaultData } from '../models/types';
import { SearchBase } from './search';
import { updateSelection } from '../utils/message';
import { SimpleSearch } from './simpleSearch';
import { SH_HOVER_CLASS, SH_PREDICT_CLASS } from '../models/constant';

enum EngineState {
  NOT_START = 'NOT_START',
  SELECT = 'SELECT',
  ANALYZE = 'ANALYZE',
}

const SH_SEARCHABLE_ELEMENT = ['*'];
// const SH_SEARCHABLE_ELEMENT = [
//   'a',
//   'h1',
//   'h2',
//   'h3',
//   'h4',
//   'h5',
//   'h6',
//   'p',
//   'span',
//   'li',
//   'td',
//   'img',
// ];

export class SHEngine {
  private state: EngineState;

  private search: SearchBase;

  constructor() {
    this.state = EngineState.NOT_START;
    this.search = new SimpleSearch();
  }

  bind() {
    SH_SEARCHABLE_ELEMENT.forEach((tag) => {
      $(tag).on('mouseover', (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.state !== EngineState.SELECT) {
          return;
        }
        e.target && this.onElementHover(e.target);
      });

      $(tag).on('click', (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.state !== EngineState.SELECT) {
          return;
        }
        e.target && this.onElementClick(e.target);
      });
    });

    this.state = EngineState.SELECT;
  }

  unbind() {
    SH_SEARCHABLE_ELEMENT.forEach((tag) => {
      $(tag).off();
    });

    this.reset();
    this.state = EngineState.NOT_START;
  }

  reset() {
    this.clearClass(SH_HOVER_CLASS);
    this.clearClass(SH_PREDICT_CLASS);
    this.state = EngineState.SELECT;
    updateSelection(GetDefaultData());
  }

  clearClass(className: string) {
    $(`.${className}`).removeClass(className);
  }

  onElementClick(element: EventTarget) {
    // remove old select & predict class

    this.clearClass(SH_PREDICT_CLASS);

    // set internal state
    this.state = EngineState.ANALYZE;

    // replace sh-hover with sh-select
    const ele = $(element as HTMLElement);
    const selectElements = this.search.select(ele);

    this.clearClass(SH_HOVER_CLASS);

    // calculate predicts
    const result = this.search.predict(ele, selectElements);
    result.elements.addClass(SH_PREDICT_CLASS);

    const copyHtml = result.elements.clone();

    copyHtml.removeClass(SH_PREDICT_CLASS);
    copyHtml.removeClass(SH_HOVER_CLASS);
    const htmls: string[] = [];
    copyHtml.each((_, ele) => {
      htmls.push(ele.outerHTML);
    });

    updateSelection({
      selected: true,
      selectedCount: result.elements.length,
      suggestSelector: result.suggestSelector,
      htmls,
      success: result.success,
    });
  }

  onElementHover(element: EventTarget) {
    this.clearClass(SH_HOVER_CLASS);
    const a = $(element as HTMLElement);
    const sameElements = this.search.select(a);

    sameElements.addClass(SH_HOVER_CLASS);

    updateSelection({
      selected: false,
      selectedCount: sameElements.length,
      suggestSelector: '',
      htmls: [],
      success: false,
    });
  }
}
