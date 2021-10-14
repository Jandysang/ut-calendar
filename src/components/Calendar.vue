<script>
import _ from 'lodash';
import { rootMixin, safeScopedSlotMixin } from '../utils/mixins';
import { createGuid, pageIsEqualToPage } from '../utils/helpers';

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
  },
};
</script>