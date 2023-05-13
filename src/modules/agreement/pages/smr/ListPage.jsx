import React from 'react';
import styled from "styled-components";
import ListContainer from "../../containers/smr/ListContainer";

const Styled = styled.div`
`;
const ListPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ListContainer/>
        </Styled>
    );
};

export default ListPage;