var JsonBuilder = {};

JsonBuilder.buildImage = (image) => {
    if(image) {
        return  {
            "id": image.id,
            "title": image.title,
            "url": image.originalimageurl,
            "credit": image.credit,
            "description": image.description
        }
    }
    return {};
}

JsonBuilder.buildImageList = (images) => {
    var list = [];
    if(images) {
        images.forEach(img => list.push(JsonBuilder.buildImage(img)));
    }
    return list;
}

JsonBuilder.buildContent = (content) => {
    if(content) {
        var publishedAt = content.epoch.pubdate? parseInt(content.epoch.pubdate): 0;
        var updatedAt = content.epoch.lastupdate? parseInt(content.epoch.lastupdate): 0;
        var author = content.author? content.author: {};

        return {
            "id": content.id,
            "headline": content.headline,
            "summary": content.summary,
            "type": content.type,
            "url": content.url,
            "publishedAt": publishedAt,
            "updatedAt": updatedAt,
            "body": content.body,
            "byline": content.byline,
            "author": author,
            "headlineImage": JsonBuilder.buildImage(content.headlineimage),
            "storyImages": JsonBuilder.buildImageList(content.storyimages)
        }
    }
    return {};
}

JsonBuilder.buildLineupItem = (item) => {
    return {
        "id": item.sourceId,
        "title": item.title,
        "description": item.description,
        "type": item.type,
        "url": item.typeAttributes.url,
        "publishedAt": item.publishedAt,
        "updatedAt": item.updatedAt,
        "headlineImage": {
            "url": item.typeAttributes.imageLarge
        }
    }
}

JsonBuilder.buildLineup = (items) => {
    var list = [];
    items.forEach(item => list.push(JsonBuilder.buildLineupItem(item)));
    return list;
}


module.exports = JsonBuilder;
