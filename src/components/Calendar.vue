<script>
import _ from 'lodash';
import { rootMixin, safeScopedSlotMixin } from '../utils/mixins';
import {
  createGuid,
  pageIsEqualToPage,
  arrayHasItems,
  addPages,
  pageIsValid,
  pageIsAfterPage,
  pageIsBeforePage
} from '../utils/helpers';
import AttributeStore from '../utils/attributeStore';
import { hasAny } from '../utils/tool';

export default {
  name: 'Calendar',
  render() {
    return <div class="container">asasdasdsadas</div>;
  },
  mixins: [rootMixin, safeScopedSlotMixin],
  provide() {
    return {
      sharedState: this.sharedState,
    };
  },
  props: {
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    step: Number,
    titlePosition: String,
    isExpanded: Boolean,
    fromDate: Date,
    toDate: Date,
    fromPage: Object,
    toPage: Object,
    minPage: Object,
    maxPage: Object,
    transition: String,
    attributes: [Object, Array],
    trimWeeks: Boolean,
    disablePageSwipe: Boolean,
  },
  data() {
    return {
      pages: [],
      store: null,
      lastFocusedDay: null,
      focusableDay: new Date().getDate(),
      transitionName: '',
      inTransition: false,
      sharedState: {
        navPopoverId: createGuid(),
        dayPopoverId: createGuid(),
        theme: {},
        masks: {},
        locale: {},
      },
    };
  },

  computed: {
    titlePosition_() {
      return this.propOrDefault('titlePosition', 'titlePosition');
    },
    firstPage() {
      return _.head(this.pages);
    },
    lastPage() {
      return _.last(this.pages);
    },
    minPage_() {
      return this.minPage || this.pageForDate(this.minDate);
    },
    maxPage_() {
      return this.maxPage || this.pageForDate(this.maxDate);
    },
    count() {
      return this.rows * this.columns;
    },
    step_() {
      return this.step || this.count;
    },
    canMovePrev() {
      return this.canMove(-this.step_);
    },
    canMoveNext() {
      return this.canMove(this.step_);
    },
  },

  watch: {
    $locale() {
      this.refreshLocale();
      this.refreshPages({ page: this.firstPage, ignoreCache: true });
      this.initStore();
    },
    $theme() {
      this.refreshTheme();
      this.initStore();
    },
    fromDate() {
      this.refreshPages();
    },
    fromPage(val) {
      const firstPage = this.pages && this.pages[0];
      if (pageIsEqualToPage(val, firstPage)) return;
      this.refreshPages();
    },
    toPage(val) {
      const lastPage = this.pages && this.pages[this.pages.length - 1];
      if (pageIsEqualToPage(val, lastPage)) return;
      this.refreshPages();
    },
    count() {
      this.refreshPages();
    },
    attributes: {
      handler(val) {
        const { adds, deletes } = this.store.refresh(val);
        this.refreshAttrs(this.pages, adds, deletes);
      },
      deep: true,
    },
    pages(val) {
      this.refreshAttrs(val, this.store.list, null, true);
    },
    disabledAttribute() {
      this.refreshDisabledDays();
    },
    lastFocusedDay(val) {
      if (val) {
        this.focusableDay = val.day;
        this.refreshFocusableDays();
      }
    },
    inTransition(val) {
      if (val) {
        this.$emit('transition-start');
      } else {
        this.$emit('transition-end');
        if (this.transitionPromise) {
          this.transitionPromise.resolve(true);
          this.transitionPromise = null;
        }
      }
    },
  },

  created() {
    this.refreshLocale();
    this.refreshTheme();
    this.initStore();
    this.refreshPages();
  },
  methods: {
    refreshLocale() {
      this.sharedState.locale = this.$locale;
      this.sharedState.masks = this.$locale.masks;
    },
    refreshTheme() {
      this.sharedState.theme = this.$theme;
    },
    initStore() {
      // 创建新的属性存储
      this.store = new AttributeStore(
        this.$theme,
        this.$locale,
        this.attributes
      );
      // 刷新现有页面的属性
      this.refreshAttrs(this.pages, this.store.list, [], true);
    },
    refreshAttrs(pages = [], adds = [], deletes = [], reset) {
      if (!arrayHasItems(pages)) return;
      // 遍历所有缓存页面
      pages.forEach((p) => {
        // 遍历所有天数
        p.days.forEach((d) => {
          let map = {};
          // 重置
          if (reset) {
            d.refresh = true;
          } else if (hasAny(d.attributesMap, deletes)) {
            // 删除属性
            map = _.omit(d.attributesMap, deletes);
            // 更新标识天
            d.refresh = true;
          } else {
            // 获取现有属性
            map = d.attributesMap || {};
          }
          // 遍历属性去添加
          adds.forEach((attr) => {
            // 如果包含当前日期，则添加它
            const targetDate = attr.intersectsDay(d);
            if (targetDate) {
              const newAttr = {
                ...attr,
                targetDate,
              };
              map[attr.key] = newAttr;
              // 更新标识天
              d.refresh = true;
            }
          });
          // Reassign day attributes
          if (d.refresh) {
            d.attributesMap = map;
          }
        });
      });
      // 刷新页面内容
      this.$nextTick(() => {
        this.$refs.pages.forEach((p) => p.refresh());
      });
    },

    refreshPages({ page, position = 1, force, transition, ignoreCache } = {}) {
      return new Promise((resolve, reject) => {
        const { fromPage, toPage } = this.getTargetPageRange(page, {
          position,
          force,
        });
        // Create the new pages
        const pages = [];
        for (let i = 0; i < this.count; i++) {
          pages.push(this.buildPage(addPages(fromPage, i), ignoreCache));
        }
        // Refresh disabled days for new pages
        this.refreshDisabledDays(pages);
        // Refresh focusable days for new pages
        this.refreshFocusableDays(pages);
        // Assign the transition
        this.transitionName = this.getPageTransition(
          this.pages[0],
          pages[0],
          transition
        );
        // Assign the new pages
        this.pages = pages;
        // Emit page update events
        this.$emit('update:from-page', fromPage);
        this.$emit('update:to-page', toPage);
        if (this.transitionName && this.transitionName !== 'none') {
          this.transitionPromise = {
            resolve,
            reject,
          };
        } else {
          resolve(true);
        }
      });
    },

    getTargetPageRange(page, { position, force } = {}) {
      let fromPage = null;
      let toPage = null;
      if (pageIsValid(page)) {
        let pagesToAdd = 0;
        position = +position;
        if (!isNaN(position)) {
          pagesToAdd = position > 0 ? 1 - position : -(this.count + position);
        }
        fromPage = addPages(page, pagesToAdd);
      } else {
        fromPage = this.getDefaultInitialPage();
      }
      toPage = addPages(fromPage, this.count - 1);
      // Adjust range for min/max if not forced
      if (!force) {
        if (pageIsBeforePage(fromPage, this.minPage_)) {
          fromPage = this.minPage_;
        } else if (pageIsAfterPage(toPage, this.maxPage_)) {
          fromPage = addPages(this.maxPage_, 1 - this.count);
        }
        toPage = addPages(fromPage, this.count - 1);
      }
      return { fromPage, toPage };
    },

    getDefaultInitialPage() {
      // 1. Try the fromPage prop
      let page = this.fromPage || this.pageForDate(this.fromDate);
      if (!pageIsValid(page)) {
        // 2. Try the toPage prop
        const toPage = this.toPage || this.pageForDate(this.toPage);
        if (pageIsValid(toPage)) {
          page = addPages(toPage, 1 - this.count);
        }
      }
      // 3. Try the first attribute
      if (!pageIsValid(page)) {
        page = this.getPageForAttributes();
      }
      // 4. Use today's page
      if (!pageIsValid(page)) {
        page = this.pageForThisMonth();
      }
      return page;
    },
  },
};
</script>