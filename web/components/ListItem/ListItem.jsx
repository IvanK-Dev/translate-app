import { InlineStack, Text, Thumbnail } from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";

export const ListItem = ({ withImage, image, title }) => {
  return (
    <InlineStack wrap={false} gap="300" blockAlign="center">
      {withImage &&
        (image?.url ? (
          <Thumbnail
            size="extraSmall"
            source={image?.url}
            alt={image?.altText}
          />
        ) : (
          <Thumbnail size="extraSmall" source={ImageMajor} alt="Empty Image" />
        ))}
      <Text as="p" fontWeight="bold">
        {title}
      </Text>
    </InlineStack>
  );
};
