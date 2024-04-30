export abstract class Entity<TType> {
  initialState: TType;
  props: TType;

  constructor(props: TType) {
    this.initialState = props;
    this.props = props;

    Object.freeze(this.initialState);
  }

  update(data: Partial<TType>) {
    this.props = { ...this.props, ...data };
  }

  commit() {
    this.initialState = this.props;
  }
}
