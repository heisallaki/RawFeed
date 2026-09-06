"""add news sources, articles, and events

Revision ID: 0976ecbaebf5
Revises: de22c45a4623
Create Date: 2026-09-06 12:48:50.144123
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '0976ecbaebf5'
down_revision: Union[str, None] = 'de22c45a4623'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('events',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('title', sa.String(length=512), nullable=False),
    sa.Column('summary', sa.Text(), nullable=False),
    sa.Column('category', sa.String(length=32), nullable=False),
    sa.Column('status', sa.String(length=16), nullable=False),
    sa.Column('country', sa.String(length=64), nullable=False),
    sa.Column('county', sa.String(length=64), nullable=True),
    sa.Column('importance_score', sa.Integer(), nullable=False),
    sa.Column('importance_reasons', sa.JSON(), nullable=False),
    sa.Column('confidence_score', sa.Integer(), nullable=False),
    sa.Column('why_it_matters', sa.Text(), nullable=True),
    sa.Column('what_we_know', sa.JSON(), nullable=False),
    sa.Column('what_we_dont_know', sa.JSON(), nullable=False),
    sa.Column('first_reported_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('last_updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('news_sources',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('feed_url', sa.String(length=512), nullable=False),
    sa.Column('website_url', sa.String(length=512), nullable=False),
    sa.Column('credibility_tier', sa.String(length=32), nullable=False),
    sa.Column('county_scope', sa.String(length=64), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('raw_articles',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('source_id', sa.UUID(), nullable=False),
    sa.Column('event_id', sa.UUID(), nullable=True),
    sa.Column('title', sa.String(length=512), nullable=False),
    sa.Column('url', sa.String(length=1024), nullable=False),
    sa.Column('raw_summary', sa.Text(), nullable=True),
    sa.Column('content_hash', sa.String(length=64), nullable=False),
    sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('fetched_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['source_id'], ['news_sources.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('url')
    )
    op.create_index(op.f('ix_raw_articles_content_hash'), 'raw_articles', ['content_hash'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_raw_articles_content_hash'), table_name='raw_articles')
    op.drop_table('raw_articles')
    op.drop_table('news_sources')
    op.drop_table('events')