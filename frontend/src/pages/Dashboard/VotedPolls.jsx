import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import CREATE_ICON from '../../assets/images/auth-card-3.png';
import EmptyCard from '../../components/cards/EmptyCard';

const PAGE_SIZE = 10;

const VotedPolls = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [votedPolls, setVotedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.VOTED_POLLS}?page=${overridePage}&limit=${PAGE_SIZE}`
      );

      const newPolls = response.data?.polls || [];

      if (newPolls.length > 0) {
        setVotedPolls((prev) => {
          if (overridePage === 1) return newPolls;
          const existingIds = new Set(prev.map((p) => p._id));
          const uniquePolls = newPolls.filter((p) => !existingIds.has(p._id));
          return [...prev, ...uniquePolls];
        });

        setHasMore(newPolls.length === PAGE_SIZE);
      } else {
        if (overridePage === 1) setVotedPolls([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls(page);
  }, [page]);

  const loadMorePolls = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className="my-5 mx-auto max-w-4xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Voted Polls History</h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgsrc={CREATE_ICON}
            message="You have not participated in any polls yet! Start exploring and share your opinion."
            btnText="Explore Polls"
            onClick={() => navigate("/dashboard")}
          />
        )}

        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text my-4">Loading voted polls...</h4>}
          endMessage={
            votedPolls.length > 0 ? (
              <p className="info-text my-6">All voted polls are displayed.</p>
            ) : null
          }
        >
          {votedPolls.map((poll) => (
            <PollCard
              key={`voted_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters?.length || 0}
              responses={poll.response || poll.responses || []}
              creatorProfileImg={poll.creator?.profileImageUrl || null}
              creatorName={poll.creator?.fullName || poll.creator?.username || "Anonymous"}
              creatorUsername={poll.creator?.username || ""}
              userHasVoted={poll.userHasVoted || true}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || ""}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;