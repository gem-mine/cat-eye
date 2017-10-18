import { connect } from 'react-redux';

function smart(mapStateToProps, mapDispatchToProps) {
  return connect(
    (state, ownProps) => {
      return mapStateToProps(state, ownProps);
    },
    null,
    (stateProps, dispatchProps, ownProps) => {
      let props = Object.assign({}, stateProps, dispatchProps, ownProps);
      if (mapDispatchToProps) {
        props = Object.assign(props, mapDispatchToProps(props));
      }
      return props;
    }
  );
}

export default smart;
