import { connect } from 'react-redux';

function smart(mapStateToProps, mapDispatchToProps) {
  return connect(
    (state, ownProps) => {
      return mapStateToProps(state, ownProps);
    },
    null,
    (stateProps, dispatchProps, ownProps) => {
      if (mapDispatchToProps) {
        return Object.assign({}, stateProps, dispatchProps, mapDispatchToProps(stateProps), ownProps);
      }
      return Object.assign({}, stateProps, dispatchProps, ownProps);
    }
  );
}

export default smart;