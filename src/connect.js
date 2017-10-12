import { connect } from 'react-redux';

function smart(mapStateToProps, mapDispatchToProps) {
  return connect(
    (state, ownProps) => {
      return mapStateToProps(state, ownProps);
    },
    null,
    props => {
      if (mapDispatchToProps) {
        return Object.assign({}, props, mapDispatchToProps(actions, props));
      }
      return { ...props };
    }
  );
}

export default smart;