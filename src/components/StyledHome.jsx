import styled from 'styled-components'

export const StyledHome = styled.div`
padding-top: 50px;
padding-bottom: 50px;
.active{
  color: #009bca;
  border: 1px solid #009bca;
  background-image: url(./img/covid.jpg);
  background-size: 160%;
  background-position:center;
  font-weight: 500;
}
.inactive{
  border: 1px solid #009bca;
}
.date{
    display: flex;
    align-items: center;
    h3{
        font-size: 20px;
        font-weight: 400;
        margin: 0 5px;
    }
}
@media screen and (max-width: 480px) {
  .date{
      display: flex;
      align-items: center;
      h3{
          font-size: 16px;
          font-weight: 400;
          margin: 0 5px;
      }
  }
  
}
.option{
    ul{
        list-style: none;
        display: flex;
        margin: 0;
        margin-top: 20px;
        padding: 0;
        li{
            padding: 10px 20px;
            cursor: pointer;
            &:nth-child(1){
            border-radius:  15px  0 0 0;
          }
          &:nth-child(2){
            border-radius: 0 15px 0 0;
          }
          }

    }
}
.select{
  &::placeholder{
    color: red;
  }
}
.reset{
  height: 30px;
  button{
    background-color: red;
    color: white;
    &:hover{
      color: white;
    }
  }
}
.Table{
  background-color: rgba(0,0,0,.1);
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #c7c7c7;
  border-top-right-radius: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  .table_scroll{
    overflow-x: scroll;
    -ms-overflow-style: none;
    overflow-block: none;
  }
  .ant-table-row{
    background-color: #fff;
  }
}
.chart{
  padding: 15px;
  border-top-right-radius: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: rgba(167,211,240,.9);
  h3{
    margin: 0;
  }
}



`