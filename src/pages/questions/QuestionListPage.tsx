import React, { useEffect } from 'react';
import { Button, Col, Row, Container } from 'react-bootstrap';
import Select from '../../components/common/Select';
import { useState } from 'react';
import Pagination from '../../components/common/Pagination';
import DynamicTable from '../../components/common/DaynamicTable';
import { QuestionRecord, QuestionSchema } from './QuestionSchema';
import { useDispatch, useSelector } from 'react-redux';
import questionModule from '../../store/features/questions';
import QuestionForm, {
  QuestionFormData,
  QuestionFormProps,
} from '../../components/questions/QuestionForm';
import { QuestionDiv } from '../../store/features/questions/questionAction';

const filterOptions = [
  {
    name: '전체',
    value: -1,
  },
  {
    name: '답변완료',
    value: 1,
  },
  {
    name: '미답변',
    value: 0,
  },
];
const limitOptions = [
  {
    name: '10개씩 보기',
    value: 10,
  },
  {
    name: '50개씩 보기',
    value: 50,
  },
  {
    name: '100개씩 보기',
    value: 100,
  },
];

const QuestionListPage = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<number>(-1);
  const [isReplied, setReplied] = useState<boolean | undefined>();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const { edit, list, search } = useSelector(questionModule.getQuestionState);
  const [formData, setFormData] = useState<QuestionFormData | null>(null);
  const [formProps, setFormProps] = useState<QuestionFormProps>({
    isReply: false,
    method: 'create',
    div: QuestionDiv.CREATE,
    show: false,
    onSubmit: () => null,
    onHide: () => null,
  });

  useEffect(() => {
    if (filter != -1) {
      setReplied(!!filter);
    }
    dispatch(
      questionModule.actions.getList({
        limit: limit,
        page: page,
        isReplied: isReplied,
      }),
    );
  }, [limit, page, filter]);

  useEffect(() => {
    setRecords(recordList());
  }, [list]);

  useEffect(() => {
    if (edit != null) {
      const data: QuestionFormData = {
        id: edit.id,
        type: edit.edges.questionType.id,
        title: edit.title,
        content: edit.content,
        div: edit.div,
        reply: edit.reply,
        fileName: edit.fileName,
      };

      setFormData(data);
    }
  }, [edit]);

  const recordList = () => {
    return list.map((q, i) => {
      const r: QuestionRecord = {
        no: i + 1,
        div: q.div,
        type: q.type,
        subject: q.title,
        createdAt: q.createdAt,
        creatorId: q.userLoginId,
        repliedAt: q.repliedAt,
        replyLoginId: q.replyUserLoginId,
        _origin: q,
      };

      return r;
    });
  };

  const onClickRecord = (r: QuestionRecord) => {
    dispatch(questionModule.actions.getById(r._origin.id));
    if (edit) {
      setFormData({
        id: edit.id,
        type: edit.edges.questionType.id,
        title: edit.title,
        content: edit.content,
        div: edit.div,
        reply: edit.reply,
        fileName: edit.fileName,
      });
      setFormProps({
        method: 'edit',
        isReply: false,
        div: edit.div,
        show: true,
        onHide: () => {
          dispatch(questionModule.actions.setEdit(null));
        },
        onSubmit: (data) => null,
      });
    }
  };

  return (
    <Container>
      <Row>
        <Col lg={6}></Col>
        <Col lg={6}>
          <Row className={'mt-4'}>
            <Col lg={6}>
              <Select
                options={filterOptions}
                selectedValue={filter}
                onChange={(e) => {
                  const option = e.target.options[e.target.selectedIndex];
                  setFilter(parseInt(option.value));
                }}
                id="filter"
                name="filter"
              />
              <Col lg={6}>
                <Select
                  options={limitOptions}
                  selectedValue={limit}
                  onChange={(e) => {
                    const option = e.target.options[e.target.selectedIndex];
                    setFilter(parseInt(option.value));
                  }}
                  id="filter"
                  name="filter"
                />
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <DynamicTable schema={QuestionSchema} records={records} />
      </Row>
      <Row className="mt-5 align-content-center">
        <Col lg={4}></Col>
        <Pagination
          currentPage={page}
          totalPage={totalPage}
          onClick={(page) => {
            setPage(page);
          }}
        />
        <Col lg={4} className="mt-5">
          <Button variant="dark" className="float-end mt-1">
            <i className="fa-solid fa-paper-plane"></i>&nbsp; 문의사항 보내기
          </Button>
        </Col>
      </Row>
      <QuestionForm {...formProps} />
    </Container>
  );
};

export default QuestionListPage;