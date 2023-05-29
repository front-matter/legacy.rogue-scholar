import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';
import { FaBloggerB, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

import BlogFormModal from '@/components/app/blogs/FormModal';
import NoSubscriptionAlert from '@/components/app/blogs/NoSubscriptionAlert';
import ConfirmModal from '@/components/app/ConfirmModal';
import Loader from '@/components/common/Loader';
import { useUserPermissions } from '@/lib/blog/permissions';
import { Database } from '@/types/supabase';

type Blog = Database['public']['Tables']['blogs']['Row'];

export default function BlogsList() {
  const supabaseClient = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { t } = useTranslation('app');
  const toast = useToast();
  const { isUserSubscribed, loading: loadingPermissions } = useUserPermissions();
  const formModal = useDisclosure();
  const confirmModal = useDisclosure();
  const [selectedBlog, setSelectedBlog] = useState<null | Blog>(null);
  const { data: blogs, isLoading: loadingBlogs } = useQuery(['blogs'], async () => {
    const { data: blogs, error } = await supabaseClient.from('blogs').select('*');

    if (error) throw new Error('Failed to fetch blogs');
    return blogs;
  });
  const tableBg = useColorModeValue('white', 'gray.700');
  const tableBorderColor = useColorModeValue('gray.100', 'gray.600');

  const openBlogForm = useCallback(
    (blog: Blog | null) => {
      setSelectedBlog(blog);
      formModal.onOpen();
    },
    [formModal, setSelectedBlog]
  );

  const openDeleteConfirm = useCallback(
    (blog: Blog | null) => {
      setSelectedBlog(blog);
      confirmModal.onOpen();
    },
    [confirmModal, setSelectedBlog]
  );

  const deleteBlogMutation = useMutation(
    async (id: string) => {
      if (!id) return;
      const { error } = await supabaseClient.from('blogs').delete().eq('id', id);

      if (error) throw new Error('Could not delete blog');
    },
    {
      // reset blog after request
      onSettled: () => setSelectedBlog(null),
      // show toast on error
      onError: () =>
        toast({
          status: 'error',
          title: t('deleteBlog.errorMessage'),
        }),
      // show toast on success and refetch blogs
      onSuccess: () => {
        toast({
          status: 'success',
          title: t('deleteBlog.successMessage'),
        });
        queryClient.invalidateQueries(['blogs']);
      },
    }
  );

  return loadingPermissions ? (
    <Loader />
  ) : (
    <>
      {!isUserSubscribed && !!blogs?.length && <NoSubscriptionAlert />}
      <HStack mb={4} justify="space-between">
        <Heading fontSize="2xl">{t('blogs.title')}</Heading>

        <Tooltip label={!isUserSubscribed && blogs?.length ? t('blogs.upgradeToCreateMore') : undefined}>
          <Button
            size="sm"
            colorScheme="primary"
            isDisabled={!isUserSubscribed && !!blogs?.length}
            leftIcon={<FaUserPlus />}
            onClick={() => openBlogForm(null)}
          >
            {t('blogs.createButton')}
          </Button>
        </Tooltip>
      </HStack>
      <Box
        bg={tableBg}
        rounded="xl"
        border="1px solid "
        borderColor={tableBorderColor}
        w="full"
        maxW="full"
        overflow="auto"
      >
        {loadingBlogs && !blogs ? (
          <Stack w="full" p={4}>
            <Skeleton rounded="lg" height="24px" />
            <Skeleton rounded="lg" height="32px" />
            <Skeleton rounded="lg" height="32px" />
            <Skeleton rounded="lg" height="32px" />
          </Stack>
        ) : (
          <Table>
            <Thead borderBottom="1px solid" borderColor={tableBorderColor}>
              <Tr>
                <Th>{t('blogs.list.columns.id')}</Th>
                <Th>{t('blogs.list.columns.title')}</Th>
                <Th>{t('blog.list.columns.feed_url')}</Th>
                <Th>{t('blog.list.columns.category')}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {blogs && blogs.length > 0 ? (
                blogs?.map((blog) => (
                  <Tr key={`blog-${blog.id}`}>
                    <Td>
                      <Link href={`/app/blogs/${blog.id}`}>{blog.title}</Link>
                    </Td>
                    <Td>{blog.title}</Td>
                    <Td>{blog.feed_url}</Td>
                    <Td>{blog.category}</Td>
                    <Td>{blog.created_at}</Td>
                    <Td>
                      <HStack justify="end" spacing={1}>
                        <IconButton
                          size="sm"
                          colorScheme="primary"
                          variant="ghost"
                          icon={<FaEdit />}
                          aria-label={t('blogs.list.edit')}
                          onClick={() => openBlogForm(blog)}
                        />
                        <IconButton
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          icon={<FaTrash />}
                          aria-label={t('blogs.list.delete')}
                          disabled={selectedBlog?.id === blog.id && deleteBlogMutation.isLoading}
                          onClick={() => openDeleteConfirm(blog)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={99}>
                    <VStack textAlign="center" p={6}>
                      <Heading fontSize="lg">{t('blogs.list.noResults')}</Heading>
                      <Text opacity={0.5}>{t('blogs.list.empty')}</Text>
                    </VStack>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </Box>
      <BlogFormModal blog={selectedBlog} isOpen={formModal.isOpen} onClose={formModal.onClose} />
      <ConfirmModal
        title={t('deleteBlogModal.title')}
        description={t('deleteBlogModal.description')}
        isDelete
        isOpen={confirmModal.isOpen}
        onClose={(confirmed) => {
          if (confirmed && selectedBlog?.id) deleteBlogMutation.mutate(selectedBlog.id);
          confirmModal.onClose();
        }}
      />
    </>
  );
}
