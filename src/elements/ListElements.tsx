import styled from 'styled-components';
import theme from './../theme';
 
const List = styled.ul`
    list-style: none;
    padding: 0 2.5rem; /* 40px */
    height: 100%;
    overflow-y: auto;
 
    li {
        grid-template-columns: 1fr 1fr 1fr auto;
    }
 
    @media (max-width: 50rem) { /*80px*/
        li {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }
    }
`;
 
const ElementList = styled.li`
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    background: ${theme.grisBackground};
    border-radius: 0.625rem;
    display: flex;
 
    & > div {
        width: 100%;
        display: flex;
        align-items: center;
    }
 
    &:hover button,
    &:hover a {
        opacity: 1;
    }
`;
 
 
const ListCategories = styled.ul`
    list-style: none;
    padding: 0 2.5rem; /* 40px */
    height: 100%;
    overflow-y: auto;
`;
 
const ElementListCategories = styled.li`
    padding: 1.25rem 0; /* 20px */
    border-bottom: 2px solid #F2F2F2;
    display: flex;
    justify-content: space-between;
`;
 
const Category = styled.div`
    font-weight: 500;
    font-size: 1.25rem; /* 20px */
    text-transform: uppercase;
    display: flex;
    align-items: center;
    
    svg {
        width: 2rem; 
        padding: .25rem;
        height: auto;
        margin-right: 1.25rem; /* 20px */
        border-radius: 50%;
        background: ${theme.grisClaro2}
    }
 
    @media (max-width: 50rem) { /* 80px */
        font-size: 1.12rem;
    }
`;
 
const Description = styled.div`
    justify-content: center;
    font-size: 1.25rem;
    text-transform: capitalize;
    @media (max-width: 50rem) { /* 50px */
        justify-content: end;
    }
`;
 
const Value = styled.div`
    font-size: 1.15rem; /* 20px */
    font-weight: 500;
    justify-content: end;
 
    @media (max-width: 50rem) { /* 80px */
        justify-content: start;
    }
`;
 
const Date = styled.div`
    text-align: center;
    font-weight: bold;
    color: ${theme.colorSecundario};
    padding: 0.62rem 3.12rem 0.62rem 0; 
    display: inline-block; 
    margin: 1.25rem 0; /* 20px */
 
    @media (max-width: 50rem) { /* 80px */
        width: 100%;
    }
`;
 
const ButtonContainer = styled.div`
    @media (max-width: 50rem) { /* 80px */
        justify-content: end;
    }
`;
 
const ActionButton = styled.button`
    outline: none;
    border: none;
    width: 1.5rem;
    display: inline-block;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 16px;
    cursor: pointer;
    border-radius: 0.31rem; /* 5px */
    margin-left: 0.625rem; /* 10px */
    transition: .3s ease all;
    display: flex;
    align-items: center;
    justify-content: center;
 
    &:hover {
        background: ${theme.grisClaro2};
    }
 
    svg {
        width: 1rem;
        color: ${theme.grisClaro}
    }
 
    @media (max-width: 50rem) { /* 80px */
        opacity: 1;
    }
`;
 
const ContainerSubtitle = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
 
const Subtitle = styled.h3`
    color: ${theme.grisClaro2};
    font-weight: 400;
    font-size: 40px;
    padding: 2.5rem 0; /* 40px */
`;
 
const ContainerButtonCentral = styled.div`
    display: flex;
    justify-content: center;
    margin: 2.5rem; /* 40px */
`;
 
const LoadButton = styled.button`
    background: ${theme.grisClaro};
    border: none;
    border-radius: 7px;
    color: #000;
    font-family: 'Work Sans', sans-serif;
    padding: 1rem 1.87rem; /* 20px 30px */
    
    font-size: 1.25rem; /* 20px */
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    outline: none;
    transition: .3s ease all;
 
    &:hover {
        background: ${theme.grisClaro2};
    }
`;
 
export {
    List,
    ElementList,
    ListCategories,
    ElementListCategories,
    Category,
    Description,
    Value,
    Date,
    ButtonContainer,
    ActionButton,
    LoadButton,
    ContainerButtonCentral,
    ContainerSubtitle,
    Subtitle
};