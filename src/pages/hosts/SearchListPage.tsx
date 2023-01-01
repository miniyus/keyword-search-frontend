import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import SearchTable from 'components/search/SearchTable';
import { SearchTableSchema } from 'components/search/schema';
import { useDispatch, useSelector } from 'react-redux';
import hostStore from 'store/features/hosts';
import Pagination from '../../components/common/Pagination';
import { useParams } from 'react-router';
import { Form } from 'react-bootstrap';

const SearchListPage = () => {
  const params = useParams();
  const hostId: number = params.id ? parseInt(params.id) : 0;
  const dispatch = useDispatch();
  const { search, page } = useSelector(hostStore.getState);
  const [pageNumber, setPageNumber] = useState<number>(page.page);
  const [pageSize, setPageSize] = useState<number>(page.pageSize);
  const [records, setRecords] = useState<SearchTableSchema[]>([]);

  const getSearch = () => {
    if (hostId) {
      dispatch(
        hostStore.actions.getSearch({
          hostId: hostId,
          page: {
            page: pageNumber,
            pageSize: pageSize,
          },
        }),
      );
    }
  };

  const mapSearchTable = () => {
    return search?.data.map((s): SearchTableSchema => {
      return {
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        shortUrl: s.shortUrl,
        id: s.id,
        publish: <Form.Check type="switch" disabled checked={s.publish} />,
        description: s.description,
        query: s.query,
        queryKey: s.queryKey,
        origin: s,
      };
    });
  };

  const setMapRecords = () => {
    const mapped = mapSearchTable();
    if (search?.data && mapped) {
      setRecords(mapped);
    }
  };

  const handlePagination = (pn: number) => {
    setPageNumber(pn);
  };

  useEffect(() => {
    setMapRecords();
  }, [search]);

  useEffect(() => {
    getSearch();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    setMapRecords();
  }, [search?.totalCount]);

  return (
    <Container className="mt-4">
      {hostId ? <SearchTable hostId={hostId} records={records} /> : null}
      <Pagination
        currentPage={pageNumber}
        totalCount={search?.totalCount || 0}
        limit={pageSize}
        onClick={handlePagination}
      />
    </Container>
  );
};

export default SearchListPage;
