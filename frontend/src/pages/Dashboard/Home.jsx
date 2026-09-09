import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import CREATE_ICON from '../../assets/images/auth-card-3.png';
import EmptyCard from '../../components/cards/EmptyCard';

const PAGE_SIZE = 10;

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`
      );

      const pollsList = response.data?.polls || [];

      if (pollsList.length > 0) {
        setAllPolls((prevPolls) => {
          if (overridePage === 1) return pollsList;
          const existingIds = new Set(prevPolls.map((p) => p._id));
          const newUnique = pollsList.filter((p) => !existingIds.has(p._id));
          return [...prevPolls, ...newUnique];
        });

        setHasMore(pollsList.length === PAGE_SIZE);
      } else {
        if (overridePage === 1) setAllPolls([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls(page);
    }
  }, [page]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto max-w-4xl">
        <HeaderWithFilter
          title="Explore Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgsrc={CREATE_ICON}
            message="Welcome! There are no polls matching this filter yet. Be the first to create one!"
            btnText="Create Poll"
            onClick={() => navigate("/create-poll")}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text my-4">Loading polls...</h4>}
          endMessage={
            allPolls.length > 0 ? (
              <p className="info-text my-6">You've reached the end of all polls.</p>
            ) : null
          }
        >
          {allPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters?.length || 0}
              responses={poll.response || poll.responses || []}
              creatorProfileImg={poll.creator?.profileImageUrl || null}
              creatorName={poll.creator?.fullName || poll.creator?.username || "Anonymous"}
              creatorUsername={poll.creator?.username || ""}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || ""}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default Home;